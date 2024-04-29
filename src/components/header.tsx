import { Image } from "@yext/pages-components";

const Header = ({ header }: any) => {
   return <>{header && <Image image={header} />}</>;
};

export default Header;
