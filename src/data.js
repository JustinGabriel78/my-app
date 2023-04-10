export const firstBox = [
    {
      id: 1,
      name: "Account 1",
      type: 1,
      parentId: null,
    },
    {
      id: 2,
      name: "Account Group 1",
      type: 0,
      parentId: null,
    },
    {
      id: 3,
      name: "Account 2",
      type: 1,
      parentId: null,
    },
    {
      id: 4,
      name: "Account Group 2",
      type: 0,
      parentId: null,
    },
  ]; //0 a group
  
  export const secondBox = [
    {
      id: 11,
      name: "Account Sub group 1",
      type: 0,
      parentId: 2,
    },
    {
      id: 12,
      name: "Account sub group 2",
      type: 0,
      parentId: 2,
    },
    {
      id: 13,
      name: "Account Sub 2 group 2",
      type: 1,
      parentId: 4,
    },
  ];
  
  export const thirdBox = [
    {
      id: 21,
      name: "Account1",
      type: 1,
      parentId: 11,
    },
    {
      id: 22,
      name: "Account2",
      type: 1,
      parentId: 11,
    },
    {
      id: 23,
      name: "Account3",
      type: 1,
      parentId: 12,
    },
  ];