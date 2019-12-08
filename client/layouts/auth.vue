<template>
  <div class="flex h-full min-h-screen">
    <div class="w-1/2 flex items-center bg-primary-lighter text-white">
      <div class="px-16">
        <h1 class="block mb-6">
          <span class="text-4xl font-bold text-white">Drawvania</span>
          <span class="text-2xl text-gray-200">Beta</span>
        </h1>
        <div class="my-4 text-xl"> &bull; <b>Follow</b> artists and topics of your interest.</div>
        <div class="my-4 text-xl"> &bull; Get your illustrations <b>discovered</b>.</div>
        <div class="my-4 text-xl"> &bull; <b>Communicate</b> through illustrations.</div>
      </div>
    </div>
    <div class="w-1/2 flex items-center bg-gray-100">
      <div
        class="bg-white p-4 rounded shadow mx-auto"
        style="width: 320px;">
        <nuxt/>
      </div>
    </div>
  </div>
</template>
