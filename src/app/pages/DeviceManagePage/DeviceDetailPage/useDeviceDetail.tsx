import { ToastMessageType, useNotify } from 'app/components/ToastNotification';
import { useHistory } from 'react-router';
import { api } from 'utils/api';
import { PrivatePath } from 'utils/url.const';
import { useCallback, useState } from 'react';
import {
  CreateDeviceParam,
  Device,
  DeviceCategory,
  UpdateDeviceParam,
} from '@hdwebsoft/boilerplate-api-sdk/libs/api/hr/models';

export const useDeviceDetail = (): {
  detail?: Device;
  categories: DeviceCategory[];
  loading: boolean;
  loadingCat: boolean;
  error?: Error;
  fetchDetail: (id: string) => Promise<void>;
  fetchCategories: () => Promise<void>;
  create: (data: CreateDeviceParam) => Promise<void>;
  createCategory: (name: string) => Promise<DeviceCategory | undefined>;
  update: (data: UpdateDeviceParam) => Promise<Device | undefined>;
  deleteCategory: (cat_id: string) => Promise<boolean>;
} => {
  const history = useHistory();
  const [detail, setDetail] = useState<Device>();
  const [categories, setCategories] = useState<DeviceCategory[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingCat, setLoadingCat] = useState<boolean>(false);
  const [error, setError] = useState<Error>();
  const { notify } = useNotify();

  const fetchDetail = useCallback(async (id: string) => {
    setLoading(true);
    try {
      const response = await api.hr.device.get(id);
      if (response) {
        setDetail(response);
      }
    } catch (error: any) {
      setError(error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    setLoadingCat(true);
    try {
      const response = await api.hr.device.category.list();
      if (response) {
        setCategories(response.results);
      }
    } catch (error: any) {
      setError(error);
    } finally {
      setLoadingCat(false);
    }
  }, []);

  const create = async (value: CreateDeviceParam) => {
    setLoading(true);
    try {
      const response = await api.hr.device.create(value);
      if (response) {
        notify({
          type: ToastMessageType.Info,
          duration: 2,
          message: 'Create device successful',
        });
        history.push(`${PrivatePath.DEVICES}/${response.id}`);
      }
    } catch (error: any) {
      setError(error);
      notify({
        type: ToastMessageType.Error,
        duration: 2,
        message: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const createCategory = async (name: string) => {
    setLoadingCat(true);
    try {
      const category = await api.hr.device.category.create({ name });
      if (category) {
        setCategories([...categories, category]);
        return category;
      }
    } catch (error: any) {
      setError(error);
      notify({
        type: ToastMessageType.Error,
        duration: 2,
        message: error.message,
      });
    } finally {
      setLoadingCat(false);
    }
  };

  const update = async (values: UpdateDeviceParam) => {
    setLoading(true);
    try {
      const response = await api.hr.device.update(values);
      if (response) {
        notify({
          type: ToastMessageType.Info,
          duration: 2,
          message: 'Update device successful',
        });
        setDetail(response);
        return response;
      }
    } catch (error: any) {
      setError(error);
      notify({
        type: ToastMessageType.Error,
        duration: 2,
        message: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteCategory = async (cat_id: string) => {
    setLoadingCat(true);
    try {
      await api.hr.device.category.delete(cat_id);
      setCategories(categories.filter(category => category.id !== cat_id));
      notify({
        type: ToastMessageType.Info,
        message: 'Delete Successfully',
        duration: 2,
      });
      return true;
    } catch (error: any) {
      setError(error);
      notify({
        type: ToastMessageType.Error,
        duration: 2,
        message: error.message,
      });
      return false;
    } finally {
      setLoadingCat(false);
    }
  };

  return {
    detail,
    categories,
    loading,
    loadingCat,
    error,
    fetchDetail,
    fetchCategories,
    create,
    createCategory,
    update,
    deleteCategory,
  };
};
