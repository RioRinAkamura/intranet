/**
 * This file is only need if you want to extract messages into JSON files in locales folder
 * AND if you are also using the object syntax instead of string syntax. \
 * Check the documentation section i18n for details
 */
import { translations } from 'locales/translations';
import { _t } from 'utils/messages';

export const ChangeLogsMessages = {
  tableDateTimeColumn: () =>
    _t(translations.ChangeLogsPage.table.dateTimeColumn, 'Date time'),
  tableUserColumn: () =>
    _t(translations.ChangeLogsPage.table.userColumn, 'User'),
  tableChangesColumn: () =>
    _t(translations.ChangeLogsPage.table.changesColumn, 'Changes'),
  tableTypeColumn: () =>
    _t(translations.ChangeLogsPage.table.typeColumn, 'Type'),
};
