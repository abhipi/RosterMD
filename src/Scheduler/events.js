export default [
  {
  id:'0',
  title: 'Case 1',
  department: 'General',
  designation: 'Resident',
  start: new Date(2023, 1, 25, 0, 0, 0),
  end: new Date(2023, 1, 25, 8, 0, 0),
  status: '0',
  burnout: '0',
  swapReason: 'eg- Personal Conflict',
},
 {
    id: '1',
    title: 'Case 2',
    department: 'General',
    designation: 'Resident',
    start: new Date(2023, 1, 25, 8, 0, 0),
    end: new Date(2023, 1, 25, 16, 0, 0),
    status: '0',
    burnout: '0',
    swapReason: 'eg- Personal Conflict',
  },
]
//Status: 0 (Uncomfirmed, created), 1 (Approved), 2(Conflict), 3 (Swap Call)