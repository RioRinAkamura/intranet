import React from 'react'
import fakeAPI from 'utils/fakeAPI';


export const useGetSkills = (): {
  loading: boolean,
  error?: Error,
  data: any;
} => {

  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(undefined);
  const [data, setData] = React.useState<any>();
  
  React.useEffect(() => {
    setLoading(true) ;
    (async () => {
      try {
        const response = await fakeAPI.get('/hr/skills');
        console.log(response, 'skill lists')
        setData(response);
      } catch(e) {
        setError(e);
      } finally {
        setLoading(false)
      }
    })();
  }, [])
  return {
    loading,
    error,
    data
  }
}
