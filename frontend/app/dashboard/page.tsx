'use client';
import { useLocale } from "next-intl";
import { useEffect } from "react";
import { useRetrieveUserQuery } from "@/redux/features/authApiSlice";
import { useRouter } from "next/navigation";
// import { useRouter } from "@/i18n/navigation";
import { RequireAuth } from "@/components/utils";

import { FlagDE, FlagES, FlagFR, FlagGB, FlagIT, FlagNL, FlagRO } from "@/components/icons";

import LanguageSelector from "@/components/common/LanguageSelector";
import LanguageSelector2 from "@/components/common/LanguageSelector2";
import LocaleSwitcher from "@/components/common/LocaleSwitcher";
import { List, Spinner } from "@/components/common";
import { toast } from "react-toastify";


export default function Page() {
  const router = useRouter();
  const locale = useLocale();

  const { data: user, isLoading, isError, refetch } = useRetrieveUserQuery(undefined, {refetchOnMountOrArgChange: true});
  console.log('retrieve user query', { user, isLoading, isError });

  const config = [
    {
      label: 'First Name',
      value: user?.first_name
    },
    {
      label: 'Last Name',
      value: user?.last_name
    },
    {
      label: 'Email',
      value: user?.email
    },
  ]
  
  useEffect(() => {
    refetch();
  }, [locale, refetch]);

  useEffect(() => { 
    if (isError) {
      toast.error('Error retrieving user data');
      router.push('/auth/login');
    }
  }, [isError, router]);


  if (!user && !isLoading) {
    toast.error('No user data found');
    return (
      <div className="flex justify-center my-8">
        No user data found.
      </div>
    );
  }


  if (isLoading) {
    return (
      <div className="flex justify-center my-8">
        Loading... <Spinner lg/>
      </div>
    );
  } 


  // const t = useTypedTranslation('forms');
  return (
    <>
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Dashboard
          </h1>
        </div>
      </header>
      <main className="mx-auto max-w-7xl py-6 my-8 sm:px-6 lg:px-8">
        <List items={config} />
      </main>
    </>
  );
}




    // <div className="flex-1 ml-64 overflow-y-auto p-6">
    //   <h1>Dashboard</h1>
    //   This is the home page. Welcome.

    //     <div className="flex flex-row items-center justify-between max-w-28">
    //       <FlagDE />
    //       <FlagFR />
    //       <FlagGB />
    //       <FlagIT />
    //       <FlagRO />

    //     </div>
    //     And now the LanguageSelector
    //     <LanguageSelector 
    //       iconLib="lu"
    //     />
    //     <div className="mt-5">
    //       Language Selector 2:
    //       <LanguageSelector2 />
    //     </div>

    //     {/* <div className="mt-10">
    //       <DropDownMenu />
    //     </div> */}

    //     <div className="mt-10">
    //       <LocaleSwitcher />
    //     </div>

    // </div>