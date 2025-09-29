import React from "react";
import styles from './styles.module.scss'
import { FadedText, WarningText } from "@/components/ui";
import { IonSpinner } from "@ionic/react";
import { getErrorMessage } from "@/service/function.ts";
import { FormBloc } from "@/components/form";
import { UpdateEmail, UpdatePassword } from "@/features/User";
import { useCurrentUser } from "@/features/auth/api";

export const Account: React.FC = () => {
  const { user, isLoading, error } = useCurrentUser();

  return <div className={ styles.page }>
    <h2>Account</h2>

    { isLoading && <IonSpinner/> }
    { error && <WarningText>{ getErrorMessage(error) }</WarningText> }

    { user && <div className={ styles.content }>
        <FormBloc>
            <div>
                <FadedText>Username</FadedText>
                <p>{ user.username }</p>
            </div>
        </FormBloc>

        <UpdateEmail/>

        <UpdatePassword/>
    </div> }
  </div>
}