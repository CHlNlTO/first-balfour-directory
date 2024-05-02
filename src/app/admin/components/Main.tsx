
import { FormTableView } from '@/app/admin/forms/FormTableView';
import { DataTableDemo } from '../forms/DataTable';
import { DirectoryPreview } from './Preview';
import { Persons } from '@/lib/types';

type MainContainerProps = {
  activePage: string;
  persons: Persons[];
  setPersons: (persons: Persons[]) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  maxId: number;
  setMaxId: (maxId: number) => void;
};

const MainContainer: React.FC<MainContainerProps> = ({ activePage, persons, setPersons, loading, setLoading, maxId, setMaxId }) => {
  switch (activePage) {
    case 'preview':
      return <DirectoryPreview persons={persons} loading={loading} />
    case 'forms':
      return (<>{/*<DataTableDemo />*/} <FormTableView persons={persons} setPersons={setPersons} loading={loading} setLoading={setLoading} maxId={maxId} setMaxId={setMaxId} /></>)
    default:
      return <div></div>;
  }
};

export default MainContainer;
