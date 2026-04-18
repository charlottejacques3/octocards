import React from 'react'
import { useForm, useFieldArray, FieldValues } from 'react-hook-form'

const FormTest = () => {

  let defaultVals = [5, 9, 12];
  let indexMap;

  
  const { control, register, handleSubmit } = useForm({
    defaultValues: {
      test: [{ value: ['hello'], id: 7}, { value: ['hello'], id: 8}, { value: ['hello'], id: 14}]
    }
  });
  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray({
    control, // control props comes from useForm (optional: if you are using FormProvider)
    name: "test", // unique name for your Field Array
  });

  const handleFormSubmit = async (data: FieldValues) => {
    console.log(data);
    console.log(data[0].value);
  }

  return (
    <div>
      <form onSubmit={handleSubmit(data => console.log(data))}>
        hello
        {fields.length}
        {fields.map((field, index) => <div key={field.id}>
          <input key={field.id} // important to include key with field's id
          {...register(`test.${index}.value` as const)} />
          {field.id} - {index}</div>)}
        {defaultVals.map((val, index) => <p>{val} - {index}</p>)}
          <button onClick={() => remove(0)}>Remove</button>
        <input type='submit'/>
      </form>
    </div>
  )
}

export default FormTest