import React from 'react';
import { cleanup, fireEvent, render } from '@testing-library/react';
import ColumnCustomize from './ColumnCustomizeContainer';

afterEach(cleanup);

const mockJson = [
  {
     "id": "1",
     "parentId": "0",
     "label": "Participant"
  },
  {
     "id": "2",
     "parentId": "1",
     "label": "Name",
  },
  {
     "id": "3",
     "parentId": "1",
     "label": "Language",
  },
  {
    "id": "4",
    "parentId": "1",
    "label": "Country",
 },
  {
     "id": "5",
     "parentId": "0",
     "label": "Game of choice",
  },
  {
     "id": "6",
     "parentId": "5",
     "label": "Game name",
  },
  {
    "id": "7",
    "parentId": "5",
    "label": "Bought",
  },
  {
    "id": "8",
    "parentId": "0",
    "label": "Performance",
  },
  {
    "id": "9",
    "parentId": "8",
    "label": "Bank balance",
  },
  {
    "id": "10",
    "parentId": "8",
    "label": "Extra info",
  }
];

describe("<ColumnCustomize /> tests", () => {
  describe("<ColumnCustomize /> Render test", () => {
    test('Default render checkbox group component', () => {
      const { getByTestId } = render(
        <ColumnCustomize treeJson={mockJson}/>,
      );
      expect(getByTestId("column-customize")).toBeTruthy()
    })
  })

  describe("<ColumnCustomize /> Interaction tests", () => {
    test('Show/hide parent accordion menu', () => {
      const { getByTestId } = render( <ColumnCustomize treeJson={mockJson}/>)
      const toggleIcon = getByTestId("group-arrow-icon");  
      expect(getByTestId("column-customize").childElementCount).toEqual(2)
      fireEvent.click(toggleIcon)
      expect(getByTestId("column-customize").childElementCount).toEqual(1)
    })

    test('Data should render on search', () => {
      const { getByTestId, getByPlaceholderText } = render( <ColumnCustomize treeJson={mockJson}/>)
      const searchInput = getByPlaceholderText(/Search/i)
      expect(getByTestId("column-group-list").childNodes.length).toEqual(3)
      fireEvent.change(searchInput, { target: { value: "Participant" }})
      expect(getByTestId("column-group-list").childNodes.length).toEqual(1)
    })

    test('Checking the parent group edit option', () => {
      const { getByTestId, getByText } = render( <ColumnCustomize treeJson={mockJson}/>)
      expect(getByTestId("column-group-list").childNodes.length).toEqual(3)
      const participantRow = getByTestId("column-group-list").firstChild.firstChild.lastElementChild;
      const editAction = participantRow.querySelector("[data-testid='edit-action']");
      fireEvent.click(editAction)
      const inlineEditTextBox = getByTestId("inline-edit-textbox");
      fireEvent.change(inlineEditTextBox, {target: { value: "Participant new" }})
      fireEvent.keyDown(inlineEditTextBox, { key: 'Enter', keyCode: 13 })
      expect(getByText("Participant new")).toBeTruthy()
    })

    test('Checking the child edit option', () => {
      const { getByTestId, getByText } = render( <ColumnCustomize treeJson={mockJson}/>)
      expect(getByTestId("column-group-list").childNodes.length).toEqual(3)
      const nameRow = getByTestId("column-group-list").firstElementChild.lastElementChild.firstElementChild;
      const editAction = nameRow.querySelector("[data-testid='edit-action']");
      fireEvent.click(editAction)
      const inlineEditTextBox = getByTestId("inline-edit-textbox");
      fireEvent.change(inlineEditTextBox, {target: { value: "Name new" }})
      fireEvent.keyDown(inlineEditTextBox, { key: 'Enter', keyCode: 13 })
      expect(getByText("Name new")).toBeTruthy()
    })

    test('Checking the parent group remove option', () => {
      const { getByTestId } = render( <ColumnCustomize treeJson={mockJson}/>)
      expect(getByTestId("column-group-list").childNodes.length).toEqual(3)
      const participantRow = getByTestId("column-group-list").firstChild.firstChild.lastElementChild;
      const removeAction = participantRow.querySelector("[data-testid='remove-action']");
      fireEvent.click(removeAction)
      expect(getByTestId("column-group-list").childNodes.length).toEqual(2)
    })

    test('Checking the child remove option', () => {
      const { getByTestId } = render( <ColumnCustomize treeJson={mockJson}/>)
      expect(getByTestId("column-group-list").childNodes.length).toEqual(3)
      const participantRow = getByTestId("column-group-list").firstElementChild.lastElementChild
      const nameRow = participantRow.firstChild;
      expect(participantRow.childElementCount).toEqual(3)
      const removeAction = nameRow.querySelector("[data-testid='remove-action']");
      fireEvent.click(removeAction)
      expect(getByTestId("column-group-list").firstElementChild.lastElementChild.childElementCount).toEqual(2)
    })

    test('On select all group checkbox', () => {
      const { getByTestId } = render( <ColumnCustomize treeJson={mockJson}/>)
      const AllSelectCheckBox = getByTestId("column-customize").firstChild.querySelector("input[type='checkbox']");
      fireEvent.click(AllSelectCheckBox)
      const allCheckboxes = getByTestId("column-customize").querySelectorAll("input[type='checkbox']");
      expect(allCheckboxes[4].checked).toEqual(true);
    })

    test('On group select checkbox', async ()  => {
      const { getByTestId } = render( <ColumnCustomize treeJson={mockJson}/>)
      const ParticipantRow = getByTestId("column-group-list").firstChild.firstElementChild.querySelector("input[type='checkbox']");
      fireEvent.click(ParticipantRow)
      const allCheckboxes = getByTestId("column-group-list").firstChild.querySelectorAll("input[type='checkbox']");
      expect.anything(allCheckboxes[2].checked)
    })

    test('On child select checkbox', async ()  => {
      const { getByTestId } = render( <ColumnCustomize treeJson={mockJson}/>)
      const NameRow = getByTestId("column-group-list").firstChild.lastChild.firstChild.querySelector("input[type='checkbox']");
      fireEvent.click(NameRow)
      const NameCheckBox = getByTestId("column-group-list").querySelector("input[value='2']");
      expect(NameCheckBox.checked).toEqual(true)
    })
  })
})