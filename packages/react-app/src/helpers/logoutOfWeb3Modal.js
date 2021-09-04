const logoutOfWeb3Modal = async web3Modal => {
  await web3Modal.clearCachedProvider();
  setTimeout(() => {
    window.location.reload();
  }, 1);
};

export default logoutOfWeb3Modal;
