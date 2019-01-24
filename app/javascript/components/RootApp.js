import React from "react"
import PropTypes from "prop-types"
import ReactTable from 'react-table'
class RootApp extends React.Component {
  render () {
    const columns = [{
          Header: 'Name',
          accessor: 'full_name'
        }, {
          Header: 'Form',
          accessor: 'form'
        }]


    return(
      <React.Fragment>
          <ReactTable
              data={this.props.players}
              columns={columns}
          />
      </React.Fragment>
    )
  }
}

RootApp.propTypes = {
  players: PropTypes.array
};
export default RootApp
