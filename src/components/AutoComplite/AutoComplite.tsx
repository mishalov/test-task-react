import React from 'react';
import Select from 'react-select';
import './AutoComplite.scss';
import { ValueType } from 'react-select/lib/types';

interface IAutoCompliteProps {
  onFilter: (label: string) => void;
  onChange: (value: ValueType<{ label: string; value: number }>) => void;
  options: { label: string; value: number }[];
  inputValue: string;
  current: string;
}

export const AutoComplite = (props: IAutoCompliteProps) => {
  const { current } = props;
  const value = current ? props.options.find(user => user.label.indexOf(current) !== -1) : null;
  return (
    <Select
      //  inputValue={props.inputValue}
      value={value}
      onChange={props.onChange}
      onInputChange={props.onFilter}
      className="auto-complite-container"
      classNamePrefix="auto-complite"
      options={props.options}
      placeholder="Choose the recipient"
      isClearable
    />
  );
};
