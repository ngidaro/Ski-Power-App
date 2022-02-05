// Function to update the specified queryKey:

import { QueryClient } from "react-query"

export const updateQueryID = (queryClient: QueryClient, queryKey: string, option: 'ADD' | 'EDIT' | 'DELETE', data: any) => {
  // data can be the data to be added/edit/deleted to the query cache
  if (Array.isArray(data)) {
    // If true then we have to either add/edit/delete multiple items
    data.forEach((dataToUpdate: any) => update(queryClient, queryKey, option, dataToUpdate));    
  } else {    
    update(queryClient, queryKey, option, data);
  }
}

const update = (queryClient: QueryClient, queryKey: string, option: 'ADD' | 'EDIT' | 'DELETE', data: any) => {
  if(option === 'ADD') {
    queryClient.setQueryData(queryKey, (old: any) => [...old, data]);
  }
  else if(option === 'EDIT') {
    queryClient.setQueryData(queryKey, (old: any) => old.map((oldData: any) => oldData._id === data._id ? data : oldData));
  }
  else if(option === "DELETE") {
    queryClient.setQueryData(queryKey, (old: any) => old.filter((oldData: any) => oldData._id !== data._id));
  }
}