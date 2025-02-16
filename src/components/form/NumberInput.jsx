import { InputNumber, Form } from 'antd';

const NumberInput = ({
  name,
  label,
  placeholder,
  value,
  onChange,
  error,
  required = false,
  prefix,
  size = 'large',
  disabled = false,
  min,
  max,
  step = 1,
  formatter,
  parser,
  rules = []
}) => {
  return (
    <Form.Item
      name={name}
      label={label}
      validateStatus={error ? 'error' : ''}
      help={error}
      required={required}
      rules={rules}
    >
      <InputNumber
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        prefix={prefix}
        size={size}
        disabled={disabled}
        min={min}
        max={max}
        step={step}
        formatter={formatter}
        parser={parser}
        style={{ width: '100%' }}
      />
    </Form.Item>
  );
};

export default NumberInput; 