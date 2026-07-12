import './App.css';
import PageTitle from './app/PageTitle/PageTitle';
import MainTabs from './app/MainTabs/MainTabs';
import SummarySquares from './app/SummarySqueres/SummarySquares';

export default function App() {
  return (
    <div className="App" dir="rtl">
      <PageTitle />
      <SummarySquares />
      <MainTabs />
    </div>
  );
}
