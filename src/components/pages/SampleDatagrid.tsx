import React, { useState } from 'react';
// 必要に応じて正しいパスを設定
import { HexColor } from '../../types/HexColor';
import HexColorEditor from '../organisms/Editor/HexColorEditor';

const TestApp: React.FC = () => {
  const [color, setColor] = useState<HexColor>(new HexColor('#ff0000'));

  return (
    <div>
      <HexColorEditor value={color} onChange={setColor} />
      <div>Current Color: {color.toString()}</div>
    </div>
  );
};

export default TestApp;