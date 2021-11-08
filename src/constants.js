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

export {
    mockJson
}