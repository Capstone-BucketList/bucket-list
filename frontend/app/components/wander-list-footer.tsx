import {
    Footer,
    FooterBrand,
    FooterCopyright,
    FooterDivider, FooterIcon,
    FooterLink,
    FooterLinkGroup,
    FooterTitle
} from "flowbite-react";
import {BsDribbble, BsFacebook, BsGithub, BsInstagram, BsTwitter} from "react-icons/bs";

export function WanderListFooter(){
    return (
        <Footer container className="bg-black text-white text-center p-4 mt-8 bottom-0 w-full rounded-none fixed">

                <div className="w-full sm:flex sm:items-center sm:justify-between">
                    <FooterCopyright href="#" by="WanderList" year={2025} />
                    <div className="mt-4 flex space-x-6 sm:mt-0 sm:justify-center">
                        <FooterIcon href="#" icon={BsFacebook} />
                        <FooterIcon href="#" icon={BsInstagram} />
                        <FooterIcon href="#" icon={BsTwitter} />
                        <FooterIcon href="#" icon={BsGithub} />
                        <FooterIcon href="#" icon={BsDribbble} />
                    </div>
                </div>

        </Footer>
    );
}

