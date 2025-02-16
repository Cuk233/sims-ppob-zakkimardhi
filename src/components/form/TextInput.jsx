import { Input, Form } from 'antd';

const TextInput = ({
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
      className="mb-6"
    >
      <Input
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        prefix={prefix}
        size={size}
        disabled={disabled}
      />
    </Form.Item>
  );
};

export default TextInput; 