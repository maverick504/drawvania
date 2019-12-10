<template>
  <div class="flex h-full min-h-screen">
    <div class="w-1/2 flex justify-center items-center bg-primary-lighter text-white">
      <div>
        <div class="my-4 text-xl"><b>Follow</b> artists and topics of your interest.</div>
        <div class="my-4 text-xl">Get your illustrations <b>discovered</b>.</div>
        <div class="my-4 text-xl"><b>Communicate</b> through illustrations.</div>
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
