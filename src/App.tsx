import Users from "pages/Users/User";
import { userColumns } from "pages/Users/userColumns";
import React from "react";
import DATA from "./components/Table/MOCK_DATA.json";
import Table from "./components/Table/Table";

function App() {
  const tableData = React.useMemo(() => DATA, []);
  const columns = React.useMemo(
    () =>
      userColumns(
        () => {
          console.log("edit");
        },
        () => {
          console.log("delete");
        }
      ),
    []
  );

  function onSelectionChange(selectedData: Record<any, any>[]) {
    console.log("Selected data:", selectedData);
  }

  return (
    <div className="App">
      <Table
        data={tableData}
        columns={columns}
        columnVisibility={{ id: false, institution: false }}
        onSelectionChange={onSelectionChange}
      />
      <Users />
    </div>
  );
}

export default App;
