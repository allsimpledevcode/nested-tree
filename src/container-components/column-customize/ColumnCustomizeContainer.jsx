import React, { memo, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { CheckBoxGroup, CheckBoxWithDragger } from '../../components';
import { SortableContainer, SortableElement, sortableHandle, arrayMove } from 'react-sortable-hoc';
import { IoIosArrowDown } from 'react-icons/io';
import { GrApps } from 'react-icons/gr';

const propTypes = {
	// flat array of object
	treeJson: PropTypes.Array
};

const DraggerIndicator = styled(GrApps)`
    margin: 0 10px;
	width: 18px;
	cursor: move
`;

const SearchContainer = styled.div`
	display: flex;
	align-items: center;
	background-color: #f3f3f3;
	padding: 12px 24px;
	border: 1px solid #ddd;
	border-right: none;
`;

const ColumnList = styled.div`
	background-color: #f3f3f3;
	padding: 16px 24px;
	max-height: 320px;
	overflow: auto;
	border: 1px solid #ddd;
	border-top: none;
	border-right: none;
`;

const ArrowIcon = styled(IoIosArrowDown)(
	({ collapse }) => `
    margin-right: 12px;
    width: 24px;
    height: 24px;
    cursor: pointer;
    position: relative;
	transform: rotate(${collapse === 'true' ? '0' : '-90'}deg);
	top: -1px;
`
);

const SearchBox = styled.input`
	margin-left: 10px;
	width: 100%;
	border: 1px solid #cac1c1;
	padding: 6px;
	border-radius: 4px;
	outline: 0;
`;
/**
 * Convert flat array to tree list arrat
 * @param {Array} treeArray 
 * @returns {Array}
 */
const listToTree = (treeArray = []) => {
	let map = {},
		node,
		res = [],
		i,
		arr = [ ...treeArray ];

	arr.forEach((a, index) => {
		map[a.id] = index;
		a.children = [];
	});
	for (i = 0; i < arr.length; i += 1) {
		node = arr[i];
		if (node.parentId !== '0') {
			arr[map[node.parentId]].children.push(node);
		} else {
			res.push(node);
		}
	}
	return res;
};
/**
 * On search filter the tree array list
 * @param {Array} array 
 * @param {String} label 
 * @returns {Array}
 */
function filter(array, label = '') {
	if (label.trim().length <= 0) {
		return array;
	}
	return array.reduce((r, { children = [], ...o }) => {
		if (o.label.toLowerCase().indexOf(label.toLowerCase()) !== -1) {
			r.push(o);
			return r;
		}
		// recursive method to check the children label
		children = filter(children, label);
		if (children.length) {
			r.push(Object.assign(o, { children }));
		}
		return r;
	}, []);
}
/**
 * Column customize component
 * @param {Array} treeJson 
 */
const ColumnCustomizeContainer = memo(({ treeJson }) => {
	const [ term, searchTem ] = useState('');
	const [ treeList, setTreeList ] = useState([]);
	const [ isOpen, setIsOpen ] = useState(true);
	// To show indicator on all select checkbox if any one of the child element is selected
	const selectedItemCount = treeJson.filter(n => n.isChecked === true).length;
	// To Show all select/unselect checkbox based on child element selection
	const isAllSelected = treeList.every(n => n.isChecked === true);

	useEffect(
		() => {
			const lists = listToTree(treeJson);
			setTreeList(lists);
		},
		[ treeJson ]
	);
	/**
	 * On select all checkbox will check/uncheck all element
	 * @param {HTMLCollection} event 
	 */

	const selectAllItems = event => {
		const clonedList = [ ...treeList ];

		clonedList.forEach((tree, index) => {
			clonedList[index].isChecked = event.target.checked;
			//if have children element will add check/uncheck value
			if (tree.children && tree.children.length > 0) {
				clonedList[index].children.map(child => (child.isChecked = event.target.checked));
			}
		});

		setTreeList(clonedList);
	};
	/**
	 * On edit this function will update the new value 
	 * @param {Object} params 
	 * @param {String} value 
	 */
	const handleActions = (params, value) => {
		const clonedTree = [ ...treeList ];
		const parentObject = clonedTree[params.parentIndex];

		if (params.hasOwnProperty('childIndex')) {
			parentObject.children[params.childIndex].label = value;
		} else {
			parentObject.label = value;
		}

		setTreeList(clonedTree);
	};
	/**
	 * On each checkbox selection click will select/unselect the item
	 * @param {Object} params 
	 * @param {Boolean} checked 
	 */
	const onSelectItem = (params, checked) => {
		const clonedTree = [ ...treeList ];
		const parentObject = clonedTree[params.parentIndex];

		if (params.hasOwnProperty('childIndex')) {
			parentObject.children[params.childIndex].isChecked = checked;

			const selectedAllField = parentObject.children.every(child => child.isChecked === true);
			if (selectedAllField) {
				parentObject.isChecked = true;
			} else {
				parentObject.isChecked = false;
			}
		} else {
			parentObject.isChecked = checked;
			parentObject.children.map(child => (child.isChecked = checked));
		}

		setTreeList(clonedTree);
	};
	/**
	 * Remove from the origin json element
	 * @param {Array} ids 
	 */
	const removeFromOriginalJson = ids => {
		ids.forEach(id => {
			const elementIndex = treeJson.findIndex(tree => tree.id === id);
			treeJson.splice(elementIndex, 1);
		});
	};

	/**
	 * On click remove option on each item it will trigger and remove the item
	 * @param {Object} params 
	 */
	const removeItem = params => {
		const clonedTree = [ ...treeList ];
		const parentObject = clonedTree[params.parentIndex];

		if (params.hasOwnProperty('childIndex')) {
			removeFromOriginalJson([ parentObject.children[params.childIndex].id ]);
			parentObject.children.splice(params.childIndex, 1);
		} else {
			removeFromOriginalJson([
				clonedTree[params.parentIndex].id,
				...clonedTree[params.parentIndex].children.map(ch => ch.id)
			]);
			clonedTree.splice(params.parentIndex, 1);
		}

		setTreeList(clonedTree);
	};

	const SortableItem = SortableElement(({ t, parentIndex }) => {
		return (
			<CheckBoxGroup
				index={parentIndex}
				node={t}
				onSelectItem={onSelectItem}
				handleActions={handleActions}
				removeItem={removeItem}
			>
				<DragHandle className="dragger" />
			</CheckBoxGroup>
		);
	});

	const SortableList = SortableContainer(({ children }) => {
		return <ColumnList data-testid="column-group-list">{children}</ColumnList>;
	});

	const DragHandle = sortableHandle(() => <DraggerIndicator />);

	const onSortEnd = ({ oldIndex, newIndex }) => {
		// update once dragged the old to new position of the element
		setTreeList(arrayMove(treeList, oldIndex, newIndex));
	};

	return (
		<div data-testid="column-customize">
			<SearchContainer>
				<ArrowIcon
					onClick={() => setIsOpen(!isOpen)}
					collapse={isOpen.toString()}
					data-testid="group-arrow-icon"
				/>
				<CheckBoxWithDragger
					isChecked={isAllSelected && treeList.length > 0}
					groupIndicator={selectedItemCount > 0 && selectedItemCount !== treeJson.length}
					onChange={selectAllItems}
				/>
				<SearchBox
					value={term}
					placeholder="Search"
					onChange={(e, a) => {
						searchTem(e.target.value);
					}}
				/>
			</SearchContainer>
			{isOpen && (
				<SortableList onSortEnd={onSortEnd} distance={1} useDragHandle>
					{filter(treeList, term).map((t, index) => (
						<SortableItem key={`item-${t.id}`} parentIndex={index} index={index} t={t} />
					))}
				</SortableList>
			)}
		</div>
	);
});

ColumnCustomizeContainer.propTypes = propTypes;

export default ColumnCustomizeContainer;
