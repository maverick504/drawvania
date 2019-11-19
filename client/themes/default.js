const TInput = {
  baseClass: 'block w-full rounded border',
  errorStatusClass: 'border-danger'
}

const TTextarea = {
  baseClass: 'block w-full rounded border'
}

const TSelect = {
  baseClass: 'block appearance-none w-full border pr-8 rounded',
}

const TButton = {
  baseClass: 'inline-block rounded border inline-flex justify-center items-center',
  primaryClass: 'text-white bg-primary border-primary hover:bg-primary-lighter hover:border-primary-lighter'
}

const TModal = {
  baseClass: 'z-40 overflow-auto left-0 top-0 bottom-0 right-0 w-full h-full fixed',
  overlayClass: 'z-40 overflow-auto left-0 top-0 bottom-0 right-0 w-full h-full fixed bg-black opacity-75',
  containerClass: 'z-50 relative p-3 mx-auto my-16 max-w-full',
  closeIconClass: 'fill-current h-6 w-6 absolute right-0 top-0 m-6',
  wrapperClass: 'bg-white rounded shadow-lg flex flex-col overflow-hidden',
  headerClass: 'bg-gray-100 p-4 text-xl',
  bodyClass: 'p-4 flex-grow',
  footerClass: 'bg-gray-100 p-4'
}

const MyOwnTheme = {
  TInput,
  TTextarea,
  TSelect,
  TButton,
  TModal
}

export default MyOwnTheme
