import React, { ChangeEvent, FC, memo, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { PrimaryButton } from '../atoms/button/PrimaryButton';

export const Login: FC = memo(() => {
  const [databaseID, setDatabaseID] = useState('');
  const { login, loading } = useAuth();
  const onClickLogin = () => login(databaseID);

  const onChangeDatabaseId = (e: ChangeEvent<HTMLInputElement>) =>
    setDatabaseID(e.target.value);

  return (
    <section className="text-gray-600 body-font">
      <div className="container px-5 py-24 mx-auto flex flex-wrap items-center">
        <div className="lg:w-3/5 md:w-1/2 md:pr-16 lg:pr-0 pr-0">
          <h1 className="title-font font-medium text-3xl text-gray-900">
            AIシフトスケジューラ
          </h1>
          <p className="leading-relaxed mt-4">
            AIを用いたシフト自動生成
          </p>
        </div>
        <div className="lg:w-2/6 md:w-1/2 bg-gray-100 rounded-lg p-8 flex flex-col md:ml-auto w-full mt-10 md:mt-0">
          <div className="relative mb-4">
            <label
              htmlFor="database-id"
              className="leading-7 text-sm text-gray-600"
            >
              データベースID
            </label>
            <input
              type="text"
              id="database-id"
              name="database-id"
              className="w-full bg-white rounded border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
              value={databaseID}
              onChange={onChangeDatabaseId}
            />
          </div>
          <PrimaryButton
            disabled={databaseID == ''}
            onClick={onClickLogin}
            loading={loading}
          >
            ログイン
          </PrimaryButton>
          <p className="text-xs text-gray-500 mt-3">
            IDを入力し、ログインボタンを押してログインしてください
          </p>
        </div>
      </div>
    </section>
  );
});
