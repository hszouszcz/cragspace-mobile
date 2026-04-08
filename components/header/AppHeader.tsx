import { Header } from '@react-navigation/elements';
import { Route } from '@react-navigation/native';
import { NativeStackNavigationOptions } from '@react-navigation/native-stack';

interface AppHeaderType {
  back?:
    | {
        title: string | undefined;
        href: string | undefined;
      }
    | undefined;
  options: NativeStackNavigationOptions;
  route: Route<string>;
}

const AppHeader = (props: AppHeaderType) => {
  const { back, options, route } = props;
  const title = typeof options.title === 'string' ? options.title : route.name;

  return <Header {...options} back={back} title={title} />;
};

export default AppHeader;
