import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import GlobalStyle from './theme/globalStyles';
import { ColumnCustomize } from './container-components/';
import { BsColumnsGap } from 'react-icons/bs';

const SideBar = styled.aside`
	position: fixed;
	right: 0;
	top: 0;
	bottom: 0;
	left: auto;
	width: 60px;
	border-left: 1px solid #ddd;
`;

const Menu = styled.ul`
	/* This is for testing purpose only*/
	margin-top: 120px;

	list-style: none;
	text-align: center;
	padding: 0;
`;

const MenuList = styled.li`position: relative;`;

const MenuListItem = styled.a(
	({ active }) => `
  display: block;
  cursor: pointer;
  padding: 18px 0;
  background-color: ${active ? '#F5F5F5' : 'transparent'};
  border-top: 1px solid ${active ? '#ddd' : 'transparent'};
  border-bottom: 1px solid ${active ? '#ddd' : 'transparent'};
  &:hover {
    background-color: #F5F5F5;
  }
`
);

const Content = styled.div(
	({ show }) => `
  position: absolute;
  top: 0;
  right: 60px;
  left: auto;
  width: 280px;
  border-radius: 4px 0 0 4px;
`
);

const ResetButton = styled.button`
	margin: 10px;
	padding: 10px;
	border: 1px solid #ddd;
	border-radius: 4px;
	font-size: 14px;
	font-weight: 600;
	letter-spacing: 0.4px;
	cursor: pointer;
`;

const mockJson = [
	{
		id: '1',
		parentId: '0',
		label: 'Participant'
	},
	{
		id: '2',
		parentId: '1',
		label: 'Name'
	},
	{
		id: '3',
		parentId: '1',
		label: 'Language'
	},
	{
		id: '4',
		parentId: '1',
		label: 'Country'
	},
	{
		id: '5',
		parentId: '0',
		label: 'Game of choice'
	},
	{
		id: '6',
		parentId: '5',
		label: 'Game name'
	},
	{
		id: '7',
		parentId: '5',
		label: 'Bought'
	},
	{
		id: '8',
		parentId: '0',
		label: 'Performance'
	},
	{
		id: '9',
		parentId: '8',
		label: 'Bank balance'
	},
	{
		id: '10',
		parentId: '8',
		label: 'Extra info'
	}
];

function checkLocalStorage() {
	if (localStorage.getItem('ops_columns') === null) {
		localStorage.setItem('ops_columns', JSON.stringify(mockJson));
	}
}

function resetStorage() {
	localStorage.setItem('ops_columns', JSON.stringify(mockJson));
	window.location.reload();
}

function App() {
	checkLocalStorage();
	const [ showNestedMenu, setNestedMenu ] = useState(false);
	const [ mockJson ] = useState(JSON.parse(localStorage.getItem('ops_columns')));
	const wrapperRef = useRef(null);

	const onToggle = () => {
		localStorage.setItem('ops_columns', JSON.stringify(mockJson, null, 2));
		setNestedMenu(!showNestedMenu);
	};

	useEffect(
		() => {
			function handleClickOutside(event) {
				if (wrapperRef.current && !wrapperRef.current.contains(event.target) && showNestedMenu === true) {
					localStorage.setItem('ops_columns', JSON.stringify(mockJson, null, 2));
					setNestedMenu(false);
				}
			}

			// Bind the event listener
			document.addEventListener('mousedown', handleClickOutside);
			return () => {
				// Unbind the event listener on clean up
				document.removeEventListener('mousedown', handleClickOutside);
			};
		},
		[ wrapperRef, setNestedMenu, showNestedMenu, mockJson ]
	);

	return (
		<div className="App">
			<GlobalStyle />
			<ResetButton onClick={resetStorage}>Reset storage</ResetButton>
			<SideBar>
				<Menu>
					<MenuList ref={wrapperRef}>
						{/* Left side nav menu icon  */}
						<MenuListItem onClick={() => onToggle()} active={showNestedMenu}>
							<BsColumnsGap />
						</MenuListItem>
						{showNestedMenu && (
							<Content>
								<ColumnCustomize treeJson={mockJson} />
							</Content>
						)}
					</MenuList>
				</Menu>
			</SideBar>
		</div>
	);
}

export default App;