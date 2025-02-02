import React, {useState} from 'react';
import {
  IonPage,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonRippleEffect,
  IonIcon,
  IonModal,
  IonCardContent,
  IonLabel,
  IonHeader,
  IonToolbar,
} from '@ionic/react';

import {useTranslation} from 'react-i18next';

import {useSelector} from 'react-redux';

import {cashOutline, share} from 'ionicons/icons';

import styles from './Invoices.module.scss';

import {rootConnector} from '../../store/thunks/index.thunks';
import {RootState} from '../../store/reducers';
import {Invoice} from '../../store/interfaces/invoice';

import {formatCurrency} from '../../utils/utils.currency';
import {contrast} from '../../utils/utils.color';

import {Settings} from '../../models/settings';

import InvoiceModal from '../../modals/invoice/InvoiceModal';
import {BackupInvoices} from '../../components/backup/BackupInvoices';

const Invoices: React.FC = () => {
  const {t} = useTranslation(['invoices', 'common']);

  const invoices: Invoice[] = useSelector((state: RootState) => state.invoices.invoices);
  const settings: Settings = useSelector((state: RootState) => state.settings.settings);

  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | undefined>(undefined);

  function closeAndRefresh() {
    setSelectedInvoice(undefined);
  }

  return (
    <IonPage>
      <IonContent>
        <main className="ion-padding">
          <IonHeader>
            <IonToolbar className="title">
              <h1>{t('invoices:invoices.title')}</h1>
            </IonToolbar>
          </IonHeader>

          {renderProjects()}
        </main>

        <IonModal isOpen={selectedInvoice !== undefined} onDidDismiss={closeAndRefresh} cssClass="fullscreen">
          <InvoiceModal closeAction={closeAndRefresh} invoice={selectedInvoice}></InvoiceModal>
        </IonModal>

        <BackupInvoices></BackupInvoices>
      </IonContent>
    </IonPage>
  );

  function renderProjects() {
    if (!invoices || invoices.length <= 0) {
      return <IonLabel className="placeholder">{t('invoices:invoices.empty')}</IonLabel>;
    }

    return (
      <div className={styles.invoices}>
        {invoices.map((invoice: Invoice, i: number) => {
          const colorContrast: string = contrast(invoice.client ? invoice.client.color : undefined);

          return (
            <IonCard key={`invoice-${i}`} onClick={() => setSelectedInvoice(invoice)} mode="md" className="ion-activatable client" color="card">
              <div style={{background: invoice.client ? invoice.client.color : undefined, color: colorContrast}}>
                <IonLabel>Export</IonLabel>
                <IonIcon icon={share} />
              </div>
              <IonCardHeader>
                <IonCardSubtitle>{invoice.client ? invoice.client.name : ''}</IonCardSubtitle>
                <IonCardTitle>{invoice.project ? invoice.project.name : ''}</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                <IonLabel>
                  <IonIcon icon={cashOutline} aria-label={t('invoices:invoices.open_bill')} /> {formatCurrency(invoice.billable, settings.currency.currency)}
                </IonLabel>
              </IonCardContent>
              <IonRippleEffect></IonRippleEffect>
            </IonCard>
          );
        })}
      </div>
    );
  }
};

export default rootConnector(Invoices);
