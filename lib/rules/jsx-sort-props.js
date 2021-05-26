/**
 * @fileoverview Enforce 'templateName' to be the first prop
 */

'use strict';

const propName = require('jsx-ast-utils/propName');
const jsxUtil = require('../util/jsx');

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

function contextCompare(a, b) {
    let aProp = propName(a);
    let bProp = propName(b);

    return aProp === 'templateName' ? -1 : 1;
}

/**
 * Create an array of arrays where each subarray is composed of attributes
 * that are considered sortable.
 * @param {Array<JSXSpreadAttribute|JSXAttribute>} attributes
 * @return {Array<Array<JSXAttribute>>}
 */
function getGroupsOfSortableAttributes(attributes) {
    const sortableAttributeGroups = [];
    let groupCount = 0;
    for (let i = 0; i < attributes.length; i++) {
        const lastAttr = attributes[i - 1];
        // If we have no groups or if the last attribute was JSXSpreadAttribute
        // then we start a new group. Append attributes to the group until we
        // come across another JSXSpreadAttribute or exhaust the array.
        if (
            !lastAttr
            || (lastAttr.type === 'JSXSpreadAttribute'
            && attributes[i].type !== 'JSXSpreadAttribute')
        ) {
            groupCount++;
            sortableAttributeGroups[groupCount - 1] = [];
        }
        if (attributes[i].type !== 'JSXSpreadAttribute') {
            sortableAttributeGroups[groupCount - 1].push(attributes[i]);
        }
    }
    return sortableAttributeGroups;
}

const generateFixerFunction = (node, context, reservedList) => {
    const sourceCode = context.getSourceCode();
    const attributes = node.attributes.slice(0);

    // Since we cannot safely move JSXSpreadAttribute (due to potential variable overrides),
    // we only consider groups of sortable attributes.

    const sortableAttributeGroups = getGroupsOfSortableAttributes(attributes);
    const sortedAttributeGroups = sortableAttributeGroups
        .slice(0)
        .map((group) => group.slice(0).sort((a, b) => contextCompare(a, b)));

    return function fixFunction(fixer) {
        const fixers = [];
        let source = sourceCode.getText();

        // Replace each unsorted attribute with the sorted one.
        sortableAttributeGroups.forEach((sortableGroup, ii) => {
            sortableGroup.forEach((attr, jj) => {
                const sortedAttr = sortedAttributeGroups[ii][jj];
                const sortedAttrText = sourceCode.getText(sortedAttr);
                fixers.push({
                    range: [attr.range[0], attr.range[1]],
                    text: sortedAttrText
                });
            });
        });

        fixers.sort((a, b) => b.range[0] - a.range[0]);

        const rangeStart = fixers[fixers.length - 1].range[0];
        const rangeEnd = fixers[0].range[1];

        fixers.forEach((fix) => {
            source = `${source.substr(0, fix.range[0])}${fix.text}${source.substr(fix.range[1])}`;
        });

        return fixer.replaceTextRange([rangeStart, rangeEnd], source.substr(rangeStart, rangeEnd - rangeStart));
    };
};

module.exports = {
    meta: {
        docs: {
            description: 'Enforce templateName to be the first prop',
            category: 'Stylistic Issues',
            recommended: true,
        },
        fixable: 'code',
        messages: {
            sortTemplateNameProp: '\'templateName\' should be the first prop'
        },
    },

    create(context) {

        return {
            JSXOpeningElement(node) {

                node.attributes.reduce((memo, decl, idx, attrs) => {
                    if (decl.type === 'JSXSpreadAttribute') {
                        return attrs[idx + 1];
                    }

                    let previousPropName = propName(memo);
                    let currentPropName = propName(decl);

                    if (currentPropName === 'templateName' && idx !== 0) {
                        context.report({
                            node: decl.name,
                            messageId: 'sortTemplateNameProp',
                            fix: generateFixerFunction(node, context)
                        });
                        return memo;
                    }

                    return decl;
                }, node.attributes[0]);
            }
        };
    }
};