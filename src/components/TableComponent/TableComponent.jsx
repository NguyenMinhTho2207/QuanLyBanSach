import React, { useState } from 'react'
import { Table } from 'antd';
import Loading from '../LoadingComponent/Loading';

const TableComponent = (props) => {
  const { selectionType = 'checkbox', data = [], isLoading = false, columns = []} = props;
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  // rowSelection object indicates the need for row selection
  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedRowKeys(selectedRowKeys);
    },
    getCheckboxProps: (record) => ({
      disabled: record.product_name === 'Disabled User',
      // Column configuration not to be checked
      name: record.product_name,
    }),
  };

  return (
    <Loading isLoading={isLoading}>
      <Table
        rowKey={(record) => record.id}
        rowSelection={{
          type: selectionType,
          ...rowSelection,
        }}
        columns={columns}
        dataSource={data}
        {...props}
      />
    </Loading>
  )
}

export default TableComponent