import {
  Category,
  CreateCategoryQueryParam,
  CreateSkillQueryParam,
  Skill,
  UpdateCategoryQueryParam,
} from '@hdwebsoft/intranet-api-sdk/libs/api/hr/models';
import { ToastMessageType, useNotify } from 'app/components/ToastNotification';
import * as React from 'react';
// import { useTranslation } from 'react-i18next';
import { api } from 'utils/api';
import { cloneDeep } from 'lodash';
// import { CategoryMessages } from './CategoryPage/messages';

export const useSkillDetails = (): {
  categories: Category[];
  skills: Skill[];
  loading: boolean;
  error?: Error;
  fetchAllCategory: () => Promise<Category[] | undefined>;
  fetchCategory: (search: string) => Promise<Category[] | undefined>;
  fetchSingleCategory: (id: string) => Promise<Category | undefined>;
  createCategory: (data: any) => Promise<any | undefined>;
  updateCategory: (data: any) => Promise<any | undefined>;
  fetchSkill: () => Promise<Skill[] | undefined>;
  createSkill: (data: any) => Promise<any | undefined>;
  updateSkill: (data: any) => Promise<any | undefined>;
  categoryLoading: boolean;
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
} => {
  // const { t } = useTranslation();
  const [loading, setLoading] = React.useState(false);
  const [categoryLoading, setCategoryLoading] = React.useState(false);
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [skills, setSkills] = React.useState<Skill[]>([]);
  const [error, setError] = React.useState<any>();
  const { notify } = useNotify();

  const fetchAllCategory = React.useCallback(async () => {
    setCategoryLoading(true);
    try {
      const response = await api.hr.category.list(
        undefined,
        undefined,
        undefined,
        1,
        500,
      );
      setCategories(response.results);
      return response.results;
    } catch (error) {
      setError(error);
    } finally {
      setCategoryLoading(false);
    }
  }, []);

  const fetchCategory = React.useCallback(async (search: string) => {
    try {
      const response = await api.hr.category.list(
        search,
        undefined,
        undefined,
        undefined,
        6,
      );
      return response.results;
    } catch (error) {
      setError(error);
    }
  }, []);

  const fetchSingleCategory = React.useCallback(async (id: string) => {
    try {
      const response = await api.hr.category.get(id);
      return response;
    } catch (error) {
      setError(error);
    }
  }, []);

  const createCategory = async (values: CreateCategoryQueryParam) => {
    setLoading(true);
    try {
      const data = cloneDeep(values);
      const response: Category = await api.hr.category.create(data);
      if (response) {
        notify({
          type: ToastMessageType.Info,
          duration: 2,
          // message: t(CategoryMessages.modalCreateTitle()),
        });
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

  const updateCategory = async (values: UpdateCategoryQueryParam) => {
    setLoading(true);
    try {
      const data = cloneDeep(values);
      const response: Category = await api.hr.category.update(data);
      if (response) {
        notify({
          type: ToastMessageType.Info,
          duration: 2,
          // message: t(CategoryMessages.modalEditTitle()),
        });
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

  const fetchSkill = React.useCallback(async () => {
    try {
      const response = await api.hr.skill.list();
      setSkills(response.results);
      return response.results;
    } catch (error) {
      setError(error);
    }
  }, []);

  const createSkill = async (values: CreateSkillQueryParam) => {
    setLoading(true);
    try {
      const data = cloneDeep(values);
      const response: any = await api.hr.skill.create(data);
      if (response) {
        notify({
          type: ToastMessageType.Info,
          duration: 2,
          message: 'Create skill successfully',
        });
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

  const updateSkill = async (values: any): Promise<any | undefined> => {
    setLoading(true);
    try {
      const data = cloneDeep(values);
      const response = await api.hr.skill.update(data);
      if (response) {
        notify({
          type: ToastMessageType.Info,
          duration: 2,
          message: 'Update skill success',
        });
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

  return {
    categories,
    skills,
    loading,
    error,
    fetchAllCategory,
    fetchCategory,
    fetchSingleCategory,
    createCategory,
    updateCategory,
    fetchSkill,
    updateSkill,
    createSkill,
    categoryLoading,
    setCategories,
  };
};
