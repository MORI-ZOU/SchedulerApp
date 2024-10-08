import { FC, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Icon } from "@iconify/react"


export const Header: FC = () => {
  const navigation = useNavigate();
  const OnClickLogout = useCallback(() =>
    navigation('/')
    , [])

  return (
    <header className="text-gray-600 body-font">
      <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
        <a className="flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="w-10 h-10 text-white p-2 bg-blue-500 rounded-full"
            viewBox="0 0 24 24"
          >
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
          </svg>
          <span className="ml-3 text-xl">AIシフトスケジューラ</span>
        </a>
        <nav className="md:mr-auto md:ml-4 md:py-1 md:pl-4 md:border-l md:border-gray-400 flex flex-wrap items-center text-base justify-center">
          <Link to="/OptimizedSchedule" className="mr-5 flex items-center hover:text-gray-900" ><Icon icon="simple-icons:createreactapp" className='mr-2' />シフト生成</Link>
          <Link to="/ManhourSetting" className="mr-5 flex items-center hover:text-gray-900"><Icon icon="mdi:account-clock-outline" className='mr-2' />工数設定</Link>
          <Link to="/EmployeeSetting" className="mr-5 flex items-center hover:text-gray-900"><Icon icon="raphael:employee" className='mr-2' />作業者情報設定</Link>
          <Link to="/ShiftSetting" className="mr-5 flex items-center hover:text-gray-900"><Icon icon="simple-line-icons:calender" className='mr-2' />シフト種類設定</Link>
          <Link to="/SkillSetting" className="mr-5 flex items-center hover:text-gray-900"><Icon icon="mingcute:tool-fill" className='mr-2' />スキル種類設定</Link>
          <Link to="/OvertimeSetting" className="mr-5 flex items-center hover:text-gray-900"><Icon icon="clarity:clock-solid" className='mr-2' />残業種類設定</Link>
        </nav>
        <button className="inline-flex items-center bg-gray-100 border-0 py-1 px-3 focus:outline-none hover:bg-gray-200 rounded text-base mt-4 md:mt-0" onClick={OnClickLogout}>
          ログアウト
          <svg
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="w-4 h-4 ml-1"
            viewBox="0 0 24 24"
          >
            <path d="M5 12h14M12 5l7 7-7 7"></path>
          </svg>
        </button>
      </div>
    </header>
  );
};
