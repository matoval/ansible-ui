import { Chip, ChipGroup } from '@patternfly/react-core';
import {
  Select,
  SelectOption,
  SelectOptionObject,
  SelectVariant,
} from '@patternfly/react-core/deprecated';
import React, { useState } from 'react';
import { getID, useID } from '../../hooks/useID';
import { PageFormGroup } from './PageFormGroup';

export type FormGroupTypeAheadMultiSelectProps = {
  id?: string;

  label: string;
  labelHelp?: string | string[] | React.ReactNode;
  labelHelpTitle?: string;

  helperText?: string;
  helperTextInvalid?: string;

  isReadOnly?: boolean;
  placeholderText?: string | React.ReactNode;
  options: { value: string | { name: string }; label: string }[];
  onSelect?: (
    event: React.MouseEvent | React.ChangeEvent,
    value: string | SelectOptionObject,
    isPlaceholder?: boolean
  ) => void;
  onHandleSelection: (value: string | SelectOptionObject | { name: string }) => void;
  isSubmitting: boolean;
  value: Partial<{ name: string }>[];
  onHandleClear: (chip?: string) => void;
};

/** A PatternFly FormGroup with a PatternFly Select */
export function FormGroupTypeAheadMultiSelect(props: FormGroupTypeAheadMultiSelectProps) {
  const {
    label,
    labelHelp,
    labelHelpTitle,
    onHandleSelection,
    onHandleClear,
    value,
    options,
    placeholderText,
    isSubmitting,
    isReadOnly,
  } = props;

  const [isOpen, setIsOpen] = useState(false);

  const chipGroupComponent = () => {
    if (!value) {
      return;
    }
    const trimmedValues = value.filter((v) => v.name && v.name.trim() !== '');
    return (
      <ChipGroup>
        {trimmedValues.map((v) => (
          <Chip
            key={v.name}
            onClick={() => {
              onHandleClear(v.name);
            }}
          >
            {v.name}
          </Chip>
        ))}
      </ChipGroup>
    );
  };

  const id = useID(props);

  return (
    <PageFormGroup fieldId={id} label={label} labelHelp={labelHelp} labelHelpTitle={labelHelpTitle}>
      <Select
        chipGroupComponent={chipGroupComponent()}
        variant={SelectVariant.typeaheadMulti}
        isCreatable
        placeholderText={!value?.length && placeholderText ? placeholderText : undefined}
        isOpen={isOpen}
        isCreateOptionOnTop
        onClear={() => onHandleClear()}
        id={id}
        ouiaId="menu-select"
        selections={value?.length ? value : undefined}
        onToggle={() => {
          setIsOpen(!isOpen);
        }}
        onSelect={(_, v) => {
          setIsOpen(!isOpen);
          onHandleSelection(typeof v === 'string' ? { name: v } : v);
        }}
        isDisabled={isReadOnly || isSubmitting}
      >
        {options.map((option) => {
          const optionId = getID(option);
          return (
            <SelectOption key={`${option.label}`} value={option.value} data-cy={optionId}>
              {option.label}
            </SelectOption>
          );
        })}
      </Select>
    </PageFormGroup>
  );
}
