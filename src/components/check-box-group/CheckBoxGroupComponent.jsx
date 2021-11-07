import React, { memo, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import CheckBox from '../checkbox-with-dragger/CheckBoxWithDraggerComponent';
import { IoIosArrowDown } from 'react-icons/io';

const propTypes = {
	// parent element with children
	node: PropTypes.object,
	// handle for every checkbox selection
	onSelectItem: PropTypes.func,
	// handle for every item name edit using inline textbox
	handleActions: PropTypes.func,
	// handle for remove item from the group
	removeItem: PropTypes.func,
	// sortable dragger handle element
	children: PropTypes.element,
	// Parent element index value
	index: PropTypes.number
};

const CheckBoxGroupContainer = styled.div`
	margin-bottom: 16px;

	&:last-child {
		margin-bottom: 0;
	}
`;

const CheckBoxGroupParent = styled.div`
	margin-bottom: 6px;
	display: flex;
	align-items: center;
`;

const ArrowIcon = styled(IoIosArrowDown)(
	({ collapse }) => `
    margin-right: 12px;
    width: 18px;
    height: 18px;
    cursor: pointer;
    position: relative;
    transform: rotate(${collapse === 'true' ? '-90' : '0'}deg);
    top: -1px;
`
);

const CheckBoxTreeList = styled.ul(
	({ collapse }) => `
    list-style: none;
    margin: 0;
    padding: 0 0 0 45px;
    display: ${collapse === 'true' ? 'none' : 'block'}
`
);

const CheckBoxTreeListItem = styled.li`
	margin: 10px 0;

	&:last-child {
		margin-bottom: 0;
	}
`;

/**
 * Multiple Checkbox component 
 * @param {Object} props 
 * @returns 
 */
const CheckBoxGroupComponent = memo(({ node, onSelectItem, handleActions, removeItem, children, index }) => {
	const [ collapse, setCollapse ] = useState(false);
	// Child item selected indicator in the group parent checkbox
	const selectedItemCount = node.children && node.children.filter(n => n.isChecked === true).length;
	// Check the all select value dynamically when click the children checkbox
	const allSelected = node.children && node.children.every(n => n.isChecked === true);

	return (
		<CheckBoxGroupContainer>
			<CheckBoxGroupParent>
				<ArrowIcon onClick={() => setCollapse(!collapse)} collapse={collapse.toString()} />
				<CheckBox
					dragger={children}
					label={node.label}
					value={node.id}
					isChecked={allSelected && node.children.length > 0}
					onChange={e => onSelectItem({ parentIndex: index }, e.target.checked)}
					groupIndicator={selectedItemCount > 0 && selectedItemCount !== node.children.length}
					onEdit={value => handleActions({ parentIndex: index }, value)}
					onRemove={() => removeItem({ parentIndex: index })}
				/>
			</CheckBoxGroupParent>
			{node.children &&
			node.children.length > 0 && (
				<CheckBoxTreeList collapse={collapse.toString()}>
					{node.children.map((child, i) => {
						return (
							<CheckBoxTreeListItem key={i.toString()}>
								<CheckBox
									value={child.id}
									label={child.label}
									isChecked={child.isChecked}
									onChange={e =>
										onSelectItem({ parentIndex: index, childIndex: i }, e.target.checked)}
									onEdit={value => handleActions({ parentIndex: index, childIndex: i }, value)}
									onRemove={() => removeItem({ parentIndex: index, childIndex: i })}
								/>
							</CheckBoxTreeListItem>
						);
					})}
				</CheckBoxTreeList>
			)}
		</CheckBoxGroupContainer>
	);
});

CheckBoxGroupComponent.propTypes = propTypes;

export default CheckBoxGroupComponent;
