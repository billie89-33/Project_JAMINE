// 📦 News Article Module Barrel File
import NewsContainer from './NewsContainer';
import NewsFormContainer from './NewsFormContainer';

export { NewsContainer as NewsModule, NewsFormContainer as NewsFormModule };
export default NewsContainer;
export * from './hooks/useNews';
export * from './hooks/useNewsForm';
