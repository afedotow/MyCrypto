import { Asset, LocalStorage, LSKeys } from '@types';
import { toArray } from '@utils';

import { NETWORKS_CONFIG, SCHEMA_BASE } from '../data';
import { createDefaultValues } from '../generateDefaultValues';
import { addDevSeedToSchema } from './devSeed';

describe('Data Seed', () => {
  let testData: LocalStorage;

  beforeAll(() => {
    const db = createDefaultValues(SCHEMA_BASE, NETWORKS_CONFIG);
    testData = addDevSeedToSchema(db);
  });

  describe('Test: Accounts', () => {
    it('includes accounts', () => {
      const accounts = toArray(testData[LSKeys.ACCOUNTS]);
      expect(accounts.length).toBeGreaterThanOrEqual(5);
    });

    it('includes addressBook', () => {
      const contacts = toArray(testData[LSKeys.ADDRESS_BOOK]);
      expect(contacts.length).toBeGreaterThan(1);
    });

    it('includes a label for each addressBook entry', () => {
      const contacts = toArray(testData[LSKeys.ADDRESS_BOOK]);
      const withLabels = contacts.filter(({ label }) => label);
      expect(contacts).toHaveLength(withLabels.length);
    });

    it('includes accounts in settings', () => {
      const { dashboardAccounts } = testData[LSKeys.SETTINGS];
      expect(dashboardAccounts.length).toBeGreaterThan(1);
    });

    it('provides a valid asset uuid to account assets', () => {
      const accountAssets = toArray(testData[LSKeys.ACCOUNTS])
        .flatMap(({ assets }) => assets)
        .map((a) => (a.uuid ? (testData.assets as Record<any, Asset>)[a.uuid] : a));
      expect(accountAssets.length).toBeGreaterThanOrEqual(1);
      accountAssets.forEach((a) => expect(a).toBeDefined());
    });
  });
});
