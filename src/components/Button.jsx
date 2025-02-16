import { Button as AntButton } from 'antd';

const Button = ({
  children,
  type = 'button',
  variant = 'primary',
  fullWidth,
  disabled = false,
  onClick,
  className = '',
  icon,
  htmlType,
  loading = false,
  size = 'middle',
  style = {}
}) => {
  // Base styles that don't conflict with Ant Design's built-in styles
  const baseStyle = {
    ...style
  };

  // Variant-specific styles
  const variantStyles = {
    primary: {
      ...baseStyle,
      minWidth: style.minWidth || '120px',
      padding: style.padding || '0 48px'
    },
    outline: {
      ...baseStyle
    }
  };

  return (
    <AntButton
      type={variant === 'primary' ? 'primary' : 'default'}
      htmlType={htmlType || type}
      disabled={disabled}
      onClick={onClick}
      block={fullWidth}
      icon={icon}
      loading={loading}
      size={size}
      className={`${className} ${variant === 'outline' ? 'outline-button' : ''}`}
      style={variantStyles[variant]}
    >
      {children}
    </AntButton>
  );
};

export default Button; 