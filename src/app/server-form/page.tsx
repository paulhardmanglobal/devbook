export default function Home() {
  async function myAction(x: FormData) {
    'use server';

    console.log(x.get('name'));
    //   CAll my database
  }

  return (
    <div>
      <form action={myAction}>
        <h1 className="text-4xl">Form</h1>
        <input type="text" name="name" className="text-black" />
      </form>
    </div>
  );
}
