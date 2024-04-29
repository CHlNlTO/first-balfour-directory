
import { FormTableView } from '@/app/admin/forms/FormTableView';
import { DataTableDemo } from '../forms/DataTable';

type MainContainerProps = {
  activePage: string;
};

const MainContainer: React.FC<MainContainerProps> = ({ activePage }) => {
  switch (activePage) {
    case 'forms':
      return (<>{/*<DataTableDemo />*/} <FormTableView /></>);
    default:
      return <div></div>;
  }
};

export default MainContainer;
