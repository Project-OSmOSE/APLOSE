import React from "react";
import styles from './styles.module.scss'
import { FadedText, WarningText } from "@/components/ui";
import { IonSpinner } from "@ionic/react";
import { getErrorMessage } from "@/service/function.ts";
import { FormBloc } from "@/components/form";
import { UserAPI } from "@/service/api/user.ts";
import { UpdateEmail, UpdatePassword } from "@/features/User";

export const Account: React.FC = () => {
  const { data: currentUser, isLoading, error } = UserAPI.endpoints.getCurrentUser.useQuery();

  return <div className={ styles.page }>
    <h2>Account</h2>

    { isLoading && <IonSpinner/> }
    { error && <WarningText>{ getErrorMessage(error) }</WarningText> }

    { currentUser && <div className={ styles.content }>
        <FormBloc>
            <div>
                <FadedText>Username</FadedText>
                <p>{ currentUser.username }</p>
            </div>
        </FormBloc>

        <UpdateEmail/>

        <UpdatePassword/>
    </div> }
  </div>
}