import { Input, Form } from 'antd';
import { LockOutlined } from '@ant-design/icons';

const PasswordInput = ({
  name,
  label,
  placeholder = 'Enter your password',
  value,
  onChange,
  error,
  required = false,
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
      <Input.Password
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        prefix={<LockOutlined />}
        size={size}
        disabled={disabled}
      />
    </Form.Item>
  );
};

export default PasswordInput;