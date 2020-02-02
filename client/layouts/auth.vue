<template>
  <div class="flex h-full min-h-screen">
    <div class="w-1/2 flex justify-center items-center bg-primary text-white">
      <div>
        <p class="mb-4"></p>
        <div class="my-4 text-xl">Follow artists of your interest.</div>
        <div class="my-4 text-xl">Get your work discovered.</div>
        <div class="my-4 text-xl">Improve your drawing skills.</div>
      </div>
    </div>
    <div class="w-1/2 flex justify-center items-center bg-gray-100 py-16">
      <div style="width: 320px;">
        <h1 class="mb-4 text-center">
          <span class="text-4xl font-bold text-primary mr-2">Drawvania</span><!--
       --><span class="text-2xl text-gray-600">Beta</span>
        </h1>
        <div class="bg-white p-4 rounded shadow">
          <nuxt/>
        </div>
      </div>
    </div>
  </div>
</template>
