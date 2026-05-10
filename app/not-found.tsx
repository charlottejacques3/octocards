import Button from "./components/Button"

const notFound = () => {
  return (
    <div className='w-full h-screen flex flex-col justify-center items-center'>
      <h4 className='text-red-600 mb-2'>Page not found</h4>
      <Button href='/' className='px-3'>Back to home</Button>
    </div>
  )
}

export default notFound