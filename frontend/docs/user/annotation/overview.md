# Annotation page

::: details Terminology

**Annotation Task**

<!--@include: ../terminology/task.md-->

**Analysis**

<!--@include: ../terminology/analysis.md-->

:::

To annotate a file you must access a campaign and then click on a file access link or on the resume button:

![](/annotation-campaign/button-resume.png)

![](/annotator/full_page.png)

This page allows to annotate audio recordings thanks to their spectrogram.

### Spectrogram visualisation

The spectrogram is labelled with time and frequency axes.
A selector above the spectrogram let you should between available FFT parameters for your spectrogram. You can also have
different frequency scales.

![](/annotator/spectro-config.png)

::: details Available frequency scales

| Scale      | Description                                                                                                                     |
|------------|---------------------------------------------------------------------------------------------------------------------------------|
| linear     | Linear scale from 0 to sample rate / 2                                                                                          |
| audible    | Linear scale from 0 to 22kHz                                                                                                    |
| porp_delph | Multi-linear scale:<ul><li>0-50%: 0 to 30kHz</li><li>50-70%: 30kHz to 80kHz</li><li>70-100%: 80kHz to sample rate / 2</li></ul> |
| dual_lf_hf | Multi-linear scale:<ul><li>0-50%: 0 to 22kHz</li><li>50-100%: 22kHz to sample rate / 2</li></ul>                                |
:::


### Zoom in spectrogram

A zoom feature is available on time only.
You can zoom with the zoom buttons next to the spectrogram configuration selector or with the mouse wheel on the
spectrogram.

![](/annotator/zoom.png)

The zoom is discrete: each zoom level offers pre-computed spectrogram, meaning zoom levels are decided by the creator of
the dataset.


### Listen to the audio file

You can listen to the recording thanks to the play/pause button bellow the spectrogram (on the left).
You can set the time position from which you want to start listen by clicking on the spectrogram.

![](/annotator/audio.png)

Next to the play/pause button, you can choose the speed of the playback (from 0.25x to 4x).
This allows you to hear high frequencies by slowing down the playback, or low frequencies by speeding up the playback.

::: tip Shortcut :keyboard:
The "space" key on your keyboard is a shortcut for playing and pausing the audio file.
:::
::: tip Tip :bulb:
Use a headset for a better listening experience!
:::
::: warning
Files with a really high sampling rate may not be compatible with your browser.
The compatibility limit depends on the browser.
Firefox tends to have the wider compatibility.
:::