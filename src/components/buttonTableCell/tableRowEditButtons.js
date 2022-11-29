import React, { Fragment, useState } from 'react';
import { Button, Space } from 'antd';
import 'antd/dist/antd.css';
import ButtonTableCell from './buttonTableCell';

/**
 * @typedef {Object} TableRowEditButtonsProps
 * @property {Boolean} [includeDelete] - whether or not to include a delete button while NOT editing
 * @property {Boolean} editing - whether or not the current row is being edited
 * @property {('small'|'middle'|'large')} size - button size
 * @property {Function} onSave - function to run after the save button is clicked
 * @property {Function} onEdit - function to run after the edit button is clicked
 * @property {Function} onCancel - function to run after the cancel button is clicked
 * @property {Function} onDelete - function to run after the delete button is clicked
 */

/**
 * @component TableRowEditButtons
 * @param {TableRowEditButtonsProps} props 
 */
function TableRowEditButtons(props) {

  return (
    <Space>
      {props.editing ? (
        <Fragment>
          <ButtonTableCell type='primary' danger={false} size={props.size} onClick={props.onSave}>
            Save
          </ButtonTableCell>
          <ButtonTableCell type='primary' danger size={props.size} onClick={props.onCancel} animated={false}>
            Cancel
          </ButtonTableCell>
        </Fragment>
      ) : (
        <Fragment>
          <ButtonTableCell type='primary' danger={false} size={props.size} onClick={props.onEdit} animated={false}>
            Edit
          </ButtonTableCell>
          {props.includeDelete ? (
            <ButtonTableCell type='primary' danger size={props.size} onClick={props.onDelete}>
              Delete
            </ButtonTableCell>
          ) : (
            null
          )}
        </Fragment>
      )}
    </Space>
  )
}

export default TableRowEditButtons;