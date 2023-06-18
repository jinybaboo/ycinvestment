import { QueryClient, QueryClientProvider} from 'react-query' 
import React from 'react';
import Home from './pages/Home';
import HighChart from './components/HighChart';
import {createBrowserRouter, RouterProvider } from 'react-router-dom';
import HighChartExpand from './components/HighChartExpand';

React.unstable_disableActingUpdates = true;

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {path:'/', element: <Home />, errorElement :<h2>페이지가 없습니다</h2>},
  {path:'/expand', element:<HighChartExpand />, errorElement:<HighChartExpand />},
  
]);

function App() {


  return (
    <QueryClientProvider client={queryClient}>
        {/* <HighChart /> */}
      <RouterProvider router={router}>
      </RouterProvider>
        {/* <Home /> */}
    </QueryClientProvider>
  );
}

export default App;

