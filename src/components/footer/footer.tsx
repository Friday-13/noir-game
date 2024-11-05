import Image from 'next/image';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer>
      <div>2024</div>
      <div>
        <Link href='https://github.com/Friday-13'>
          <Image src='/github-icon.svg' width='30' height='30' alt='GitHub' />
        </Link>
      </div>
      <div>
        <Link href='https://www.linkedin.com/in/samsonenkodm/'>
          <Image
            src='/linkedin-icon.svg'
            width='30'
            height='30'
            alt='LinkedIn'
          />
        </Link>
      </div>
    </footer>
  );
};

export default Footer;
