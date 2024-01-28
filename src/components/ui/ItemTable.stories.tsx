import { ItemTable, Props } from "./ItemTable";
import { DataTableDemo } from "./TestTable";

export default {
  title: "Components/ItemTable",
  component: ItemTable,
  argTypes: {},
};

const Template = (args: Props) => <ItemTable {...args} />;

export const Default = Template.bind(null, {
  items: [
    {
      id: 0,
      collapse: false,
      name: "level 0",
      retainSize: 100,
      shallowSize: 100,
      children: [],
    },
    {
      id: 1,
      collapse: false,
      name: "level 0 Debug",
      retainSize: 200,
      shallowSize: 23,
      children: [
        {
          id: 12,
          collapse: false,
          name: "function",
          retainSize: 200,
          shallowSize: 111,
          children: [
            {
              id: 14,
              collapse: false,
              name: "function",
              retainSize: 200,
              shallowSize: 111,
              children: [],
            },
          ],
        },
        {
          id: 23,
          collapse: false,
          name: "functiona asdfadsfdsa",
          retainSize: 20,
          shallowSize: 31,
          children: [],
        },
      ],
    },
  ],
  totalSize: 1000,
} as Props);

export const DataTable = () => {
  return <DataTableDemo />;
};
