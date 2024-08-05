import React, { FC } from 'react';

type Props = {
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
  children: React.ReactNode;
};

export const PrimaryButton: FC<Props> = ({
  onClick,
  disabled = false,
  loading = false,
  children,
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      style={{
        padding: '10px 20px',
        backgroundColor: disabled || loading ? '#d3d3d3' : '#3182ce',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: disabled || loading ? 'not-allowed' : 'pointer',
        fontSize: '16px',
      }}
    >
      {loading ? 'Loading...' : children}
    </button>
  );
};
