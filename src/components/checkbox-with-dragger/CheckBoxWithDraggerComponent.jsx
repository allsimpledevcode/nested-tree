import React, { Fragment, useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { GrApps } from 'react-icons/gr';
import { BiTrash, BiPencil } from 'react-icons/bi';

const propTypes = {
	// handle for the checkbox selection
	onChange: PropTypes.func.isRequired,
	// Label for the checkbox element
	label: PropTypes.string,
	// Pass check box check/uncheck property
	isChecked: PropTypes.bool,
	// To change the checkbox icon based on the value
	groupIndicator: PropTypes.bool,
	// Handle for remove action
	onRemove: PropTypes.func,
	// Handle for edit action
	onEdit: PropTypes.func,
	// Dynamic sorting dragger option
	dragger: PropTypes.func
};

const defaultProps = {
	isChecked: false,
	onChange: () => {},
	groupIndicator: false
};

const Actions = styled.div`
	position: absolute;
	right: 0px;
	top: 1px;
	width: 53px;
	left: auto;
	display: none;
	background-color: #f3f3f3;
	box-shadow: -23px -1px 7px -1px #f7f0f0;
`;

const CheckBoxWrapper = styled.div`
	position: relative;
	width: ${props => (props.label ? '100%' : 'auto')};

	&:hover ${Actions} {
		display: block;
	}
`;

const CheckboxContainer = styled.label`
	display: flex;
	align-items: center;
	text-align: left;
`;

const Icon = styled.svg`
	fill: none;
	stroke: white;
	stroke-width: 2px;
`;

const HiddenCheckbox = styled.input.attrs({ type: 'checkbox' })`
  border: 0;
  clip: rect(0 0 0 0);
  clippath: inset(50%);
  height: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 0;
  position: absolute;
  white-space: nowrap;
  width: 1px;
`;

const StyledCheckbox = styled.div`
	display: inherit;
	width: 16px;
	height: 16px;
	${props => {
		if (props.checked) {
			return `
				background-color: #2295f3;
			`;
		} else if (props.show) {
			return `
				background-color: #5f6365;
			`;
		} else {
			return `
				background-color: transparent;
			`;
		}
	}} border: 1px solid ${props => (props.checked ? '#2295f3' : '#5f6365')};
	border-radius: 3px;
	transition: all 150ms;

	${HiddenCheckbox}:focus + & {
		box-shadow: 0 0 0 1px #2295f3;
	}

	${Icon} {
		visibility: ${props => (props.checked || props.show ? 'visible' : 'hidden')};
	}
`;

const DraggerIndicator = styled(GrApps)`
    margin: 0 10px;
	width: 18px;
	cursor: no-drop;
`;

const getCommonActionCSS = `
	cursor: pointer;
    width: 16px;
    height: 16px;
    padding: 1px;
    display: inline-block;
`;

const EditActionButton = styled(BiPencil)`
	${getCommonActionCSS}
	margin: 0 10px;
	fill: #333;
`;

const DeleteActionButton = styled(BiTrash)`
	${getCommonActionCSS}
	fill: red;
`;

const InlineEditTextBox = styled.input.attrs({ type: 'text' })`
	width: 100%;
	padding: 3px;
	border-radius: 4px;
	border: 1px solid ${props => (props.error ? '#f44336' : '#ddd')};
	outline: 0
`;
/**
 *  Checkbox with dragger component
 */
const CheckBoxWithDraggerComponent = ({ isChecked, label, groupIndicator, onRemove, onEdit, dragger, ...props }) => {
	const showGroupToggleIcon = groupIndicator && isChecked !== true;
	const [ inlineEdit, setInlineEdit ] = useState(false);
	const [ textValue, setTextValue ] = useState(label);
	const [ error, setError ] = useState(false);
	const wrapperRef = useRef(null);

	useEffect(
		() => {
			function handleClickOutside(event) {
				if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
					setInlineEdit(false);
					onEdit(textValue);
				}
			}

			// Bind the event listener
			document.addEventListener('mousedown', handleClickOutside);
			return () => {
				// Unbind the event listener on clean up
				document.removeEventListener('mousedown', handleClickOutside);
			};
		},
		[ wrapperRef, textValue, onEdit ]
	);

	const handleEnter = (e = {}, onMouseDown = false) => {
		if (e.key === 'Enter' || onMouseDown) {
			setError(false);
			if (textValue.trim().length <= 0) {
				setError(true);
			} else {
				setInlineEdit(false);
				onEdit(textValue);
			}
		}
	};

	return (
		<CheckBoxWrapper label={label}>
			<CheckboxContainer>
				<HiddenCheckbox checked={isChecked} {...props} />
				<StyledCheckbox checked={isChecked} show={showGroupToggleIcon}>
					<Icon viewBox="0 0 24 24">
						{showGroupToggleIcon ? <polyline points="5 12 20 12" /> : <polyline points="20 6 9 17 4 12" />}
					</Icon>
				</StyledCheckbox>
				{label && (
					<Fragment>
						{/* This option for add dragger from the sortable element */}
						{dragger ? dragger : <DraggerIndicator />}
						{inlineEdit ? (
							<InlineEditTextBox
								ref={wrapperRef}
								data-testid="inline-edit-textbox"
								error={error}
								value={textValue}
								onChange={e => {
									setTextValue(e.target.value);
								}}
								onKeyDown={handleEnter}
							/>
						) : (
							<span>{label}</span>
						)}
					</Fragment>
				)}
			</CheckboxContainer>
			{label &&
			!inlineEdit && (
				<Actions>
					<EditActionButton onClick={() => setInlineEdit(!inlineEdit)} data-testid="edit-action" />
					<DeleteActionButton onClick={onRemove} data-testid="remove-action" />
				</Actions>
			)}
		</CheckBoxWrapper>
	);
};

CheckBoxWithDraggerComponent.propTypes = propTypes;

CheckBoxWithDraggerComponent.defaultProps = defaultProps;

export default CheckBoxWithDraggerComponent;