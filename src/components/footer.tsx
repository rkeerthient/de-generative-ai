import { Image } from "@yext/pages-components";
const Footer = ({ footer }: any) => {
  return <>{footer && <Image image={footer} />}</>;
};

export default Footer;
